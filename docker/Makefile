#########################################################
# imports
#########################################################

include .env

MARIADB_PASS := ${DATABASE_ROOT_PASS}

#########################################################
# variables
#########################################################

COMPOSE := docker-compose
BUILD := $(COMPOSE) build --no-cache
UP := $(COMPOSE) up -d
DOWN := $(COMPOSE) down
EXEC = $(COMPOSE) exec $(CONTAINER) bash $(ARG)
CONTAINER =
ARG =

# docker services (container name)
MARIADB := mariadb

#########################################################
# make commands
#########################################################

init:
	@make build up

build:
	@$(BUILD)

up:
	@$(UP)

down:
	@$(DOWN)

remove:
	@$(DOWN) --rmi all --volumes --remove-orphans

exec-mariadb:
	$(eval CONTAINER := $(MARIADB))
	$(eval ARG := -c "\
	mysql -uroot -p$(MARIADB_PASS)\
	")
	@$(EXEC)