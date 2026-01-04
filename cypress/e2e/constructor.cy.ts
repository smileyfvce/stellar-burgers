describe('Конструктор бургеров', () => {
  // переменная для хранения ингредиентов
  let ingredient: any[];

  beforeEach(() => {
    cy.fixture('ingredients.json').then((data) => {
      // сохраняем массив ингредиентов
      ingredient = data.data;
    });
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );

    // переходим на главную страницу
    cy.visit('/');

    // токены
    cy.window().then((win) => {
      win.localStorage.setItem('accessToken', 'access-token');
    });
    cy.setCookie('token', 'refresh-token');

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
    // ищем в массиве булку
    const bun = ingredient.find((ing) => ing.type === 'bun');

    cy.get(`[data-cy="ingredient-${bun._id}"]`)
      .find('button')
      .contains('Добавить')
      .click();
    // проверяем что булка в конструкторе
    cy.get('[data-cy="burger-constructor"]').should('contain', bun.name);
  });

  it('добавляем булку и начинку в конструктор', () => {
    // ищем в массиве булку
    const bun = ingredient.find((ing) => ing.type === 'bun');
    // ищем в массиве начинку
    const main = ingredient.find((ing) => ing.type === 'main');

    cy.get(`[data-cy="ingredient-${bun._id}"]`)
      .find('button')
      .contains('Добавить')
      .click();
    cy.get(`[data-cy="ingredient-${main._id}"]`)
      .find('button')
      .contains('Добавить')
      .click();
    // проверяем что булка в конструкторе
    cy.get('[data-cy="burger-constructor"]').should('contain', bun.name);
    // проверяем что начинка в конструкторе
    cy.get('[data-cy="burger-constructor"]').should('contain', main.name);
  });

  it('открываем модальное окно', () => {
    // ищем в массиве булку
    const bun = ingredient.find((ing) => ing.type === 'bun');
    cy.get(`[data-cy="ingredient-${bun._id}"]`).click();
    // проверяем что модалка видна
    cy.get('[data-cy="modal"]').should('be.visible');
  });

  it('закрываем модальное окно через клик на крестик', () => {
    // ищем в массиве булку
    const bun = ingredient.find((ing) => ing.type === 'bun');
    cy.get(`[data-cy="ingredient-${bun._id}"]`).click();
    cy.get('[data-cy="modal-close"]').click();
    // проверяем что модалки нет
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('закрываем модальное окно по клику на оверлей', () => {
    // ищем в массиве булку
    const bun = ingredient.find((ing) => ing.type === 'bun');
    cy.get(`[data-cy="ingredient-${bun._id}"]`).click();
    cy.get('[data-cy="modal-overlay"]').click({ force: true });
    // проверяем что модалки нет
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('закрываем модальное окно по нажатию esc', () => {
    // ищем в массиве булку
    const bun = ingredient.find((ing) => ing.type === 'bun');
    cy.get(`[data-cy="ingredient-${bun._id}"]`).click();
    // проверяем что модалка видна
    cy.get('[data-cy="modal"]').should('be.visible');
    cy.get('body').type('{esc}');
    // проверяем что модалки нет
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('оформляем заказ', () => {
    // ищем в массиве булку
    const bun = ingredient.find((ing) => ing.type === 'bun');
    // ищем в массиве начинку
    const main = ingredient.find((ing) => ing.type === 'main');
    // добавляем булку
    cy.get(`[data-cy="ingredient-${bun._id}"]`)
      .find('button')
      .contains('Добавить')
      .click();

    // добавляем начинку
    cy.get(`[data-cy="ingredient-${main._id}"]`)
      .find('button')
      .contains('Добавить')
      .click();

    // проверяем наличие ингредиентов в конструкторе
    cy.get('[data-cy="burger-constructor"]').should(
      'contain',
      bun.name
    );
    cy.get('[data-cy="burger-constructor"]').should(
      'contain',
      main.name
    );

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
    cy.get('[data-cy="burger-constructor"]').should(
      'not.contain',
      bun.name
    );
    cy.get('[data-cy="burger-constructor"]').should(
      'not.contain',
      main.name
    );
  });
});
