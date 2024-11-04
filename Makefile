
DOCKER_DEV_COMPOSE_FILE := docker-compose.yml
DOCKER_E2E_COMPOSE_FILE := docker-compose-e2e.yml

PROJECT_NAME := cocktails
PROJECT_NAME_E2E := cocktails-e2e



start:
	@ ${INFO} "Building required docker images"
	@ docker-compose -f $(DOCKER_DEV_COMPOSE_FILE) -p ${PROJECT_NAME} build
	@ ${INFO} "Build Completed successfully"
	@ echo " "
	@ ${INFO} "Starting local development server"
	@ docker-compose -f $(DOCKER_DEV_COMPOSE_FILE) -p ${PROJECT_NAME} up 

test:
	@ ${INFO} "Building required docker images"
	@ docker-compose -f $(DOCKER_E2E_COMPOSE_FILE) -p ${PROJECT_NAME_E2E} build
	@ ${INFO} "Build Completed successfully"
	@ echo " "
	@ ${INFO} "Starting local development server"
	@ docker-compose -f $(DOCKER_E2E_COMPOSE_FILE) -p ${PROJECT_NAME_E2E} up \
		--abort-on-container-exit \
		--exit-code-from backend-e2e
	@ docker-compose -f $(DOCKER_E2E_COMPOSE_FILE) -p ${PROJECT_NAME_E2E} down

stop:
	@ ${INFO} "Stopping Running containers"
	@ docker-compose stop
	@ ${SUCCESS} "Successfully stopped running containers"

down:
	@ docker-compose -f $(DOCKER_DEV_COMPOSE_FILE) -p ${PROJECT_NAME} down



# COLORS
GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
NC := "\e[0m"


# Shell Functions
INFO := @bash -c 'printf "\n"; printf $(YELLOW); echo "===> $$1"; printf "\n"; printf $(NC)' SOME_VALUE
SUCCESS := @bash -c 'printf "\n"; printf $(GREEN); echo "===> $$1"; printf "\n"; printf $(NC)' SOME_VALUE