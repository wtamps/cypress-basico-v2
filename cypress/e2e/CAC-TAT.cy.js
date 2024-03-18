/// <reference types = "Cypress" />

describe('Central de atendimento ao Cliente TAT', () => {
  beforeEach(() => {
    cy.visit('./src/index.html')
  })
  it('verifica o titulo da aplicação', () => {
    cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
  })

  it('preenche os campos obrigatórios e envia o formulário', () => {
    const longText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In iaculis diam vitae urna lacinia, eget iaculis turpis euismod. Fusce volutpat tellus vel urna tincidunt, nec tristique dolor condimentum. Mauris commodo pharetra nulla. Donec ex sem, venenatis eu ipsum quis, vestibulum lobortis ante. Morbi convallis lacus cursus mattis ullamcorper. Proin lobortis nibh eget nulla pretium, non euismod ipsum dictum. Aliquam maximus lobortis congue. Proin rutrum arcu non felis mattis, vitae aliquet lacus molestie. Proin quis blandit nisl, eget sodales quam. Cras congue quis purus vitae vehicula. Maecenas nec venenatis enim. Quisque nec ante id odio ultrices cursus sed sit amet lectus. Duis sapien lacus, facilisis at neque et, aliquam blandit arcu.    Duis aliquet sapien vel lacus pretium, a dictum quam lobortis. Proin quis interdum tellus. Nam nulla ligula, aliquet id luctus sit amet, finibus sit amet sapien. Suspendisse libero dui, pretium a cursus consectetur, accumsan et mauris. Aliquam sollicitudin, justo nec venenatis ultrices, ante mauris gravida elit, ut pulvinar dui libero a augue. Maecenas imperdiet egestas ipsum eu fringilla. Aenean interdum quam tempor libero fermentum pharetra. Proin placerat erat vitae auctor tincidunt.'
    
    cy.get('#firstName').type('Winicius')
    cy.get('#lastName').type('Andrade')
    cy.get('#email').type('test@test.com')
    cy.get('#open-text-area').type(longText, { delay:0 })

    cy.contains('.button', 'Enviar').should('be.enabled').click()
    cy.get('.success').should('be.visible', 'Mensagem enviada com sucesso.')
  })
  
  it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
    cy.get('#firstName').type('Winicius')
    cy.get('#lastName').type('Andrade')
    cy.get('#email').type('test')
    cy.get('#open-text-area').type('short Text')

    cy.contains('.button', 'Enviar').should('be.enabled').click()
    cy.get('.error').should('be.visible', 'Valide os campos obrigatórios!')
  })

  it('campo telefone continua vazio quando não preenchido com valor numérico', () => {
    cy.get('#phone')
    .type('adadadadad')
    .should('have.value', '')
  })

  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
    cy.get('#firstName').type('Winicius')
    cy.get('#lastName').type('Andrade')
    cy.get('#email').type('test@test.com')
    cy.get('#open-text-area').type('short Text')
    
    cy.get('#phone-checkbox').check()

    cy.contains('.button', 'Enviar').click()
    cy.get('.error').should('be.visible', 'Valide os campos obrigatórios!')
  })

  it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
    cy.get('#firstName')
      .type('Winicius')
      .should('have.value', 'Winicius')
      .clear()
      .should('have.value', '')
    cy.get('#lastName')
      .type('Andrade')
      .should('have.value', 'Andrade')
      .clear()
      .should('have.value', '')
    cy.get('#email')
      .type('test@test.com')
      .should('have.value', 'test@test.com')
      .clear()
      .should('have.value', '')
    cy.get('#phone')
      .type('99999999999')
      .should('have.value', '99999999999')
      .clear()
      .should('have.value', '')
  })

  it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
    cy.contains('.button', 'Enviar').click()
    cy.get('.error').should('be.visible', 'Valide os campos obrigatórios!')
  })

  it('envia o formulário com sucesso usando um comando customizado', () => {
    cy.fillMandatoryFieldsAndSubmit()
    cy.get('.success').should('be.visible', 'Mensagem enviada com sucesso.')
  })

  it('seleciona um produto (Youtube) por seu texto', () => {
    cy.get('#product')
      .select('YouTube')
      .should('have.value', 'youtube')
  })

  it('seleciona um produto (Mentoria) por seu value', () => {
    cy.get('#product')
      .select('mentoria')
      .should('have.value', 'mentoria')
  })

  it('seleciona um produto (Blog) por seu índice', () => {
    cy.get('#product')
      .select(1)
      .should('have.value', 'blog')
  })

  it('marca o tipo de atendimento "Feedback"', () => {
    cy.get('input[type="radio"][value="feedback"]')
      .check()
      .should('have.value', 'feedback')
  })

  it('marca cada tipo de atendimento', () => {
    cy.get('input[type="radio"]')
      .should('have.length', 3)
      .each(function($radio){
        cy.wrap($radio).check()
        cy.wrap($radio).should('be.checked')
      })
  })

  it('marca ambos checkboxes, depois desmarca o último', () => {
    cy.get('input[type="checkbox"]')
      .check()
      .last()
      .uncheck()
      .should('not.be.checked')
  })
  
  it('seleciona um arquivo da pasta fixtures', () => {
    cy.get('#file-upload')
      .should('not.have.value')
      .selectFile('./cypress/fixtures/example.json')
      .should(function($input){
        expect($input[0].files[0].name).to.equal('example.json')
      })
  })

  it('seleciona um arquivo simulando um drag-and-drop', () => {
    cy.get('#file-upload')
      .should('not.have.value')
      .selectFile('./cypress/fixtures/example.json', { action: 'drag-drop'})
      .should(function($input){
        expect($input[0].files[0].name).to.equal('example.json')
      })
  })

  it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
    cy.fixture('example.json').as('sampleFile')
    cy.get('#file-upload')
      .selectFile('@sampleFile')
      .should(function($input){
        expect($input[0].files[0].name).to.equal('example.json')
      })
  })

  it('verifica que a politica de privacidade abre em outra aba sem a necessidade de um clique', () => {
    cy.get('#privacy a')
      .should('have.attr', 'target', '_blank')
  })

  it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
    cy.get('#privacy a')
      .invoke('removeAttr', 'target')
      .click()
    cy.contains('Talking About Testing').should('be.visible')
  })

})