CREATE TABLE IF NOT EXISTS holds (
    id SERIAL PRIMARY KEY,

    item_id INTEGER NOT NULL,
    patron_id INTEGER NOT NULL,

    hold_date DATE NOT NULL DEFAULT CURRENT_DATE,

    status VARCHAR(20) NOT NULL DEFAULT 'Active',

    fulfilled_date DATE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_holds_item
        FOREIGN KEY (item_id)
        REFERENCES items(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_holds_patron
        FOREIGN KEY (patron_id)
        REFERENCES patrons(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_holds_status
        CHECK (status IN ('Active', 'Fulfilled', 'Cancelled'))
);