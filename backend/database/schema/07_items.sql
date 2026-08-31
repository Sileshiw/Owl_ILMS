CREATE TABLE IF NOT EXISTS items (
    item_id SERIAL PRIMARY KEY,

    book_id INTEGER NOT NULL,

    barcode VARCHAR(100) NOT NULL UNIQUE,

    accession_number VARCHAR(100) UNIQUE,

    call_number VARCHAR(100),

    copy_number VARCHAR(50),

    location VARCHAR(255),

    status VARCHAR(50) NOT NULL DEFAULT 'Available',

    acquisition_date DATE,

    price NUMERIC(12,2),

    condition VARCHAR(100) DEFAULT 'Good',

    notes TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_items_book
        FOREIGN KEY (book_id)
        REFERENCES books(book_id)
        ON DELETE CASCADE,

    CONSTRAINT chk_item_status
        CHECK (status IN (
            'Available',
            'Checked Out',
            'Reserved',
            'Lost',
            'Damaged',
            'Missing',
            'Withdrawn'
        ))
);