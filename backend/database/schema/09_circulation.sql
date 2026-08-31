CREATE TABLE IF NOT EXISTS circulation (
    circulation_id SERIAL PRIMARY KEY,

    item_id INTEGER NOT NULL,

    patron_id INTEGER NOT NULL,

    issue_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    due_date TIMESTAMP NOT NULL,

    return_date TIMESTAMP,

    renewal_count INTEGER NOT NULL DEFAULT 0,

    status VARCHAR(50) NOT NULL DEFAULT 'Issued',

    fine_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,

    notes TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_circulation_item
        FOREIGN KEY (item_id)
        REFERENCES items(item_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_circulation_patron
        FOREIGN KEY (patron_id)
        REFERENCES patrons(patron_id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_circulation_status
        CHECK (status IN (
            'Issued',
            'Returned',
            'Overdue',
            'Lost'
        )),

    CONSTRAINT chk_renewal_count
        CHECK (renewal_count >= 0),

    CONSTRAINT chk_fine_amount
        CHECK (fine_amount >= 0),

    CONSTRAINT chk_return_date
        CHECK (
            return_date IS NULL
            OR return_date >= issue_date
        )
);