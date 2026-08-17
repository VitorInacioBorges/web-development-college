-- use this in postgresql query tool inside 'Tables'
CREATE TABLE contatos (
id serial NOT NULL,
name character varying(50) NOT NULL,
phone character varying(15) NOT NULL,
email character varying(50) NOT NULL,
note text,
active boolean DEFAULT true,
CONSTRAINT contatos_pkey PRIMARY KEY (id) );