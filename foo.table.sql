CREATE TABLE foo (
    bar integer,
    bat varchar(20),
    baz date
);

SELECT * FROM foo;

INSERT INTO foo(
  bar,
  bat,
  baz
)
VALUES (
  1,
  "some string",
  null
);

UPDATE foo
SET baz = NOW()
WHERE bar = 1;

DESCRIBE foo;