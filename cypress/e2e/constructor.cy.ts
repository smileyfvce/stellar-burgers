describe('Конструктор бургеров', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );

    // токены
    window.localStorage.setItem('accessToken', 'access-token');
    cy.setCookie('token', 'refresh-token');

    // переходим на главную страницу
    cy.visit('http://localhost:4000');
    // ждём загрузки ингредиентов
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    // очистка
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('страница загружена', () => {
    cy.contains('Соберите бургер');
  });

  it('добавляем булку в конструктор', () => {
    cy.get('[data-cy="ingredient-1"]')
      .find('button')
      .contains('Добавить')
      .click();
      // проверяем что булка в конструкторе
    cy.get('[data-cy="burger-constructor"]').should(
      'contain',
      'Краторная булка N-200i'
    );
  });

  it('добавляем булку и начинку в конструктор', () => {
    cy.get('[data-cy="ingredient-1"]')
      .find('button')
      .contains('Добавить')
      .click();
    cy.get('[data-cy="ingredient-2"]')
      .find('button')
      .contains('Добавить')
      .click();
      // проверяем что булка в конструкторе
    cy.get('[data-cy="burger-constructor"]').should(
      'contain',
      'Краторная булка N-200i'
    );
      // проверяем что начинка в конструкторе
    cy.get('[data-cy="burger-constructor"]').should('contain', 'Биокотлета из марсианской Магнолии');
  });

  it('открываем модальное окно', () => {
    cy.get('[data-cy="ingredient-1"]').click();
    // проверяем что модалка видна
    cy.get('[data-cy="modal"]').should('be.visible');
  });

  it('закрываем модальное окно через клик на крестик', () => {
    cy.get('[data-cy="ingredient-1"]').click();
    cy.get('[data-cy="modal-close"]').click();
    // проверяем что модалки нет
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('закрывает модальное окно по клику на оверлей', () => {
    cy.get('[data-cy="ingredient-1"]').click();
    cy.get('[data-cy="modal-overlay"]').click({ force: true });
    // проверяем что модалки нет
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('оформляем заказ', () => {
    // добавляем булку
    cy.get('[data-cy="ingredient-1"]')
      .find('button')
      .contains('Добавить')
      .click();
    
    // добавляем начинку
    cy.get('[data-cy="ingredient-2"]')
      .find('button')
      .contains('Добавить')
      .click();
    
    // проверяем наличие ингредиентов в конструкторе
    cy.get('[data-cy="burger-constructor"]').should('contain', 'Краторная булка N-200i');
    cy.get('[data-cy="burger-constructor"]').should('contain', 'Биокотлета из марсианской Магнолии');
    
    // ждём авторизацию
    cy.wait('@getUser');
    
    // клик по оформлению заказа
    cy.get('[data-cy="order-button"]').click();
    
    // ждем создание заказа
    cy.wait('@createOrder');
    
    // проверяем что модалка видна
    cy.get('[data-cy="modal"]').should('be.visible');
    // проверяем содержит ли модалка номер заказа
    cy.get('[data-cy="modal"]').should('contain', '12345');
    
    // закрываем модальное окно
    cy.get('[data-cy="modal-close"]').click();
    // проверяем что модалки нет
    cy.get('[data-cy="modal"]').should('not.exist');
    
    // проверяем что в конструкторе нет наших ингредиентов
    cy.get('[data-cy="burger-constructor"]').should('not.contain', 'Краторная булка');
    cy.get('[data-cy="burger-constructor"]').should('not.contain', 'Биокотлета');
  });

  it('проверяем что мы используем моковые данные', () => {
    cy.contains('Краторная булка N-200i');
    cy.contains('Биокотлета из марсианской Магнолии');
  });

  it('моковые токены авторизации', () => {
    expect(window.localStorage.getItem('accessToken')).to.equal('access-token');
  });
});