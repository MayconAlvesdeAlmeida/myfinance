--tabela users
CREATE TABLE public.users (
	id serial4 NOT NULL,
	"name" varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	reset_password varchar(255) NULL,
	active bool DEFAULT true NULL,
	CONSTRAINT users_email_key UNIQUE (email),
	CONSTRAINT users_pkey PRIMARY KEY (id)
);

--tabela costs
CREATE TABLE public.costs (
	id serial4 NOT NULL,
	user_id int4 NOT NULL,
	title varchar(255) NOT NULL,
	description text NULL,
	value numeric(10, 2) NOT NULL,
	transaction_date date DEFAULT CURRENT_DATE NOT NULL,
	CONSTRAINT costs_pkey PRIMARY KEY (id),
	CONSTRAINT costs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);
CREATE INDEX idx_user_id_costs ON public.costs USING btree (user_id);

--tabela receivements
CREATE TABLE public.receivements (
	id serial4 NOT NULL,
	user_id int4 NOT NULL,
	title varchar(255) NOT NULL,
	description text NULL,
	value numeric(10, 2) NOT NULL,
	transaction_date date DEFAULT CURRENT_DATE NOT NULL,
	CONSTRAINT receivements_pkey PRIMARY KEY (id),
	CONSTRAINT receivements_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);
CREATE INDEX idx_user_id ON public.receivements USING btree (user_id);

--tabela confirm_registration
CREATE TABLE public.confirm_registration (
	id serial4 NOT NULL,
	user_id int4 NOT NULL,
	code varchar(5) NOT NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	verified bool DEFAULT false NULL,
	CONSTRAINT confirm_registration_pkey PRIMARY KEY (id),
	CONSTRAINT confirm_registration_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

--tabela statements
CREATE TABLE public.statements (
	id serial4 NOT NULL,
	user_id int4 NOT NULL,
	"type" varchar(50) NOT NULL,
	receivement_id int4 NULL,
	cost_id int4 NULL,
	previous_balance numeric(10, 2) NOT NULL,
	updated_balance numeric(10, 2) NOT NULL,
	transaction_date timestamp DEFAULT now() NOT NULL,
	CONSTRAINT statements_check CHECK ((((receivement_id IS NOT NULL) AND (cost_id IS NULL)) OR ((receivement_id IS NULL) AND (cost_id IS NOT NULL)))),
	CONSTRAINT statements_pkey PRIMARY KEY (id),
	CONSTRAINT statements_type_check CHECK (((type)::text = ANY ((ARRAY['R'::character varying, 'C'::character varying])::text[]))),
	CONSTRAINT statements_cost_id_fkey FOREIGN KEY (cost_id) REFERENCES public.costs(id) ON DELETE SET NULL,
	CONSTRAINT statements_receivement_id_fkey FOREIGN KEY (receivement_id) REFERENCES public.receivements(id) ON DELETE SET NULL,
	CONSTRAINT statements_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);
CREATE INDEX idx_user_id_statements ON public.statements USING btree (user_id);

--tabela balances
CREATE TABLE public.balances (
	id serial4 NOT NULL,
	user_id int4 NOT NULL,
	value numeric(10, 2) DEFAULT 0 NOT NULL,
	CONSTRAINT balances_pkey PRIMARY KEY (id),
	CONSTRAINT balances_user_id_key UNIQUE (user_id),
	CONSTRAINT balances_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);