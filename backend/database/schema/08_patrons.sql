CREATE TABLE IF NOT EXISTS patrons (
    patron_id SERIAL PRIMARY KEY,

    patron_number VARCHAR(50) NOT NULL UNIQUE,

    first_name VARCHAR(100) NOT NULL,

    middle_name VARCHAR(100),

    last_name VARCHAR(100) NOT NULL,

    email VARCHAR(255) UNIQUE,

    phone VARCHAR(50),

    address TEXT,

    patron_type VARCHAR(50) NOT NULL DEFAULT 'General',

    registration_date DATE NOT NULL DEFAULT CURRENT_DATE,

    expiry_date DATE,

    status VARCHAR(50) NOT NULL DEFAULT 'Active',

    max_books_allowed INTEGER NOT NULL DEFAULT 5,

    notes TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_patron_type
        CHECK (patron_type IN (
            'Student',
            'Staff',
            'Faculty',
            'Researcher',
            'General',
            'Child'
        )),

    CONSTRAINT chk_patron_status
        CHECK (status IN (
            'Active',
            'Inactive',
            'Suspended',
            'Expired'
        )),

    CONSTRAINT chk_max_books
        CHECK (max_books_allowed >= 0)
);