const { body } = require('express-validator');
const { cpf, cnpj } = require('cpf-cnpj-validator');

// Regras para a criação de um novo cliente
const createClienteRules = () => {
  return [
    // Regra para o nome
    body('nome')
      .isString().withMessage('O nome deve ser um texto.')
      .notEmpty({ ignore_whitespace: true }).withMessage('O nome é um campo obrigatório.')
      .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s.\-&]+$/).withMessage('O nome contém caracteres inválidos.'),

    // Regra para o e-mail
    body('email')
      .isEmail().withMessage('O e-mail informado é inválido.'),

    // Regra para o telefone
    body('telefone')
      .notEmpty({ ignore_whitespace: true }).withMessage('O telefone é obrigatório.')
      .matches(/^[0-9\s()-]+$/).withMessage('O telefone deve conter apenas números, parênteses, traços e espaços.'),

    // Regra para o tipo_pessoa
    body('tipo_pessoa')
      .isIn(['FISICA', 'JURIDICA']).withMessage("Tipo de pessoa deve ser 'FISICA' ou 'JURIDICA'."),

    // Regra customizada para o documento (CPF/CNPJ)
    body('documento').custom((value, { req }) => {
      const { tipo_pessoa } = req.body;
      if (!value) {
        throw new Error('O documento é obrigatório.');
      }
      
      if (tipo_pessoa.toUpperCase() === 'FISICA') {
        if (!cpf.isValid(value)) {
          throw new Error('O CPF informado é inválido.');
        }
      } else if (tipo_pessoa.toUpperCase() === 'JURIDICA') {
        if (!cnpj.isValid(value)) {
          throw new Error('O CNPJ informado é inválido.');
        }
      }
          return true;
    }),
    
    // Regra para o endereço
    body('endereco')
      .notEmpty({ ignore_whitespace: true }).withMessage('O endereço é obrigatório.'),
      
    // Regra para a data de nascimento
    body('data_nascimento')
      .notEmpty().withMessage('A data de nascimento é obrigatória.')
      .isISO8601({ strict: true, strictSeparator: true }).withMessage('A data de nascimento deve estar no formato AAAA-MM-DD.')
      .custom((value) => {
        const dataNascimento = new Date(value);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0); // Zera a hora para comparar apenas a data
        
        if (dataNascimento > hoje) {
          throw new Error('A data de nascimento não pode ser uma data futura.');
        }
        return true;
      }),
  ];
};

// Regras para a atualização de um cliente
const updateClienteRules = () => {
  return createClienteRules(); // Reutiliza as mesmas regras da criação
};

module.exports = {
  createClienteRules,
  updateClienteRules,
};