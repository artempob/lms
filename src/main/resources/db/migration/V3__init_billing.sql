-- "Товары" в контексте биллинга (локальная копия данных о курсе)
CREATE TABLE billing_products (
                                  course_id UUID PRIMARY KEY,
                                  price DECIMAL(10, 2) NOT NULL,
                                  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Кошельки пользователей
CREATE TABLE wallets (
                         id UUID PRIMARY KEY,
                         user_id UUID NOT NULL UNIQUE,
                         balance DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
                         updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- История транзакций (пополнения и списания)
CREATE TABLE transactions (
                              id UUID PRIMARY KEY,
                              wallet_id UUID NOT NULL REFERENCES wallets(id),
                              amount DECIMAL(10, 2) NOT NULL,
                              type VARCHAR(20) NOT NULL, -- DEPOSIT, WITHDRAWAL
                              description TEXT,
                              created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_wallet ON transactions(wallet_id);