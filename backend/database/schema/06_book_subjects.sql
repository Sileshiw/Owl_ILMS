CREATE TABLE IF NOT EXISTS book_subjects (
    book_id INTEGER NOT NULL,
    subject_id INTEGER NOT NULL,

    subject_type VARCHAR(100) DEFAULT 'Main Subject',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (book_id, subject_id),

    CONSTRAINT fk_book_subjects_book
        FOREIGN KEY (book_id)
        REFERENCES books(book_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_book_subjects_subject
        FOREIGN KEY (subject_id)
        REFERENCES subjects(subject_id)
        ON DELETE CASCADE
);