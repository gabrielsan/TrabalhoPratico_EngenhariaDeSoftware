const ENVIRONMENT = {
    ERROR_REASONS_CODE:
    {
        EXPIRED_TOKEN: 'EXPIRED_TOKEN',
        AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
        EMPTY_TOKEN: 'EMPTY_TOKEN',
        DATA_EMPTY: 'DATA_EMPTY',
        USER_DUPLICATE: 'USER_DUPLICATE',
        INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
        FORBIDDEN_REGISTER: 'FORBIDDEN_REGISTER',
        FOREIGN_KEY_ERROR: 'FOREIGN_KEY_ERROR',
        VALIDATION_ERROR: 'VALIDATION_ERROR',
        EMPTY_RESULT: 'EMPTY_RESULT',
        INTERNAL_ERROR: 'INTERNAL_ERROR',
        INVALID_REPORT: 'INVALID_REPORT'
    },
    ERROR_REASONS_TEXT:
    {
        EXPIRED_TOKEN: 'Token expirado! Faça login novamente.',
        AUTHENTICATION_ERROR: 'Falha na autenticação do token.',
        EMPTY_TOKEN: 'Token de autenticação não fornecido',
        DATA_EMPTY: 'Existem informações que não foram preenchidas.',
        USER_DUPLICATE: 'Já existe um usuário registrado com este e-mail.',
        INVALID_CREDENTIALS: 'Credenciais inválidas',
        FORBIDDEN_REGISTER: 'Você não pode editar registros de outro usuário.',
        FOREIGN_KEY_ERROR: 'Erro de chave estrangeira. Verifique as dependências.',
        VALIDATION_ERROR: 'Erro de validação. Verifique os dados enviados.',
        EMPTY_RESULT: 'Nenhum registro identificado.',
        INTERNAL_ERROR: 'Erro interno do servidor.',
        INVALID_REPORT: 'Tipo de relatório inválido.'
    },
    TRANSACTION_TYPES: 
    {
        1: 'DESPESA',
        2: 'RECEITA'
    }
}

module.exports = ENVIRONMENT;