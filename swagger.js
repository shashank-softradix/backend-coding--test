const swaggerJsdoc = require('swagger-jsdoc')

const options = {
    definition:{
        opneapi:'3.0.0',
        info:{
          description: "Backend Coding Test Api's.",
            title:"Backend Coding Test",
            version:'1.0.0'
        },
        "schemes": [
          'http'
      ],
      host:'localhost:8010',
    },
    apis:[]
}

const swaggerDoc = swaggerJsdoc(options);

swaggerDoc.paths = {
    "/rides": {
        "post": {
            "tags": [
                "Backend Test"
            ],
            "summary": "APi for create ride information",
            "parameters": [
                {
                    "name": "body",
                    "in":"body",
                    "required": "true",
                    "type": "object",
                    "schema": {
                        "properties": {
                            "start_lat": {
                                "type": "string"
                            },
                            "start_long": {
                                "type": "string"
                            },
                            "end_lat": {
                                "type": "string"
                            },
                            "end_long": {
                                "type": "string"
                            },
                            "rider_name": {
                                "type": "string"
                            },
                            "driver_name": {
                                "type": "string"
                            },
                            "driver_vehicle": {
                                "type": "string"
                            }
                        }
                    }
                }
            ],
            "responses": {
                "200": {
                    "description": "ok"
                }
            },
        }
    },
    "/rides-list": {
        "get": {
            "tags": [
                "Backend Test"
            ],
            "summary": "Api for list all the rides",
            "parameters": [
                {
                    "name": "page",
                    "in": "query",
                    "required": "true",
                    "type":"number"
                },
                {
                    "name": "length",
                    "in": "query",
                    "required": "true",
                    "type":"number"
                }
            ],
            "responses": {
                "200": {
                    "description": "ok"
                }
            },
        }
    },
    "/rides/{id}": {
        "get": {
            "tags": [
                "Backend Test"
            ],
            "parameters": [
                {
                    "name":"id",
                    "in":"path",
                    "type":"number",
                    "required": "true"
                }
            ],
            "responses": {
                "200": {
                    "description": "ok"
                }
            },
        }
    }
};

swaggerDoc.securityDefinitions = {
    "authorization": {
      "type": "apiKey",
      "name": "authorization",
      "in": "header"
    }
}

module.exports = swaggerDoc