# 1. Documentação e Comentário de Código
Comentários (ou docstrings) devem ser usados exclusivamente para explicar o "porquê" de soluções complexas ou trechos de lógica de negócio não óbvios. Toda função e classe pública deve ter uma documentação de interface (parâmetros e retorno) clara.

# 2. Padrão de Notação de Código
Adotar Camel Case para variáveis e funções ($nomeVariavel$) e Pascal Case para classes e componentes ($NomeDaClasse$). O código deve ser formatado automaticamente por um linter (como Prettier ou ESLint) para garantir a padronização de espaços e indentação.

# 3. Aplicação de princípios SOLID
Utilizar os princípios SOLID como base para uma arquitetura bem estruturada.

# 4. Nomes Claros e Significativos
Usar nomes de variáveis e funções que revelem sua intenção e que sejam pronunciáveis e pesquisáveis. Nomes como $listaClientesAtivos$ são preferíveis a $l$ ou $la$.

# 5. Evitar Código Duplicado 
O princípio Don't Repeat Yourself deve ser aplicado. Sempre que um trecho de código for repetido três ou mais vezes, ele deve ser extraído para uma função ou módulo reutilizável.

# 6. Organização Modular de Arquivos 
O projeto deve ser estruturado de forma modular, separando os arquivos por responsabilidade (e.g., services, controllers, models) ou por funcionalidade (e.g., pasta $Clientes$, pasta $Produtos$).