const { body } = require('express-validator');

const orcamentoRules = () => {
  return [
    // Regra para o cliente_id
    body('cliente_id')
      .notEmpty().withMessage('O ID do cliente é obrigatório.')
      .isInt({ min: 1 }).withMessage('O ID do cliente deve ser um número inteiro válido.'),

    // Regra para a descrição (opcional, mas se existir, deve ser texto)
    body('descricao')
      .optional({ checkFalsy: true }) // checkFalsy: true permite string vazia
      .isString().withMessage('A descrição deve ser um texto.'),

    // Regra para a lista de itens
    body('itens')
      .isArray({ min: 1 }).withMessage('O orçamento deve ter pelo menos um item.'),

    // Regras para CADA item dentro da lista
    body('itens.*.descricao_item')
      .optional({ checkFalsy: true })
      .isString().withMessage('A descrição do item deve ser um texto.'),

    body('itens.*.largura')
      .notEmpty().withMessage('A largura do item é obrigatória.')
      .isFloat({ min: 0.01 }).withMessage('A largura do item deve ser um número positivo.'),

    body('itens.*.comprimento')
      .notEmpty().withMessage('O comprimento do item é obrigatório.')
      .isFloat({ min: 0.01 }).withMessage('O comprimento do item deve ser um número positivo.'),

    body('itens.*.preco_m2')
      .notEmpty().withMessage('O preço por m² do item é obrigatório.')
      .isFloat({ min: 0.01 }).withMessage('O preço por m² do item deve ser um número positivo.'),
  ];
};

module.exports = {
  orcamentoRules,
};