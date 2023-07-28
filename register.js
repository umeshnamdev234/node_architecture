
const register = {
    "type": "object",
    "properties": {
      "name": { "type": "string", "minLength": 3, "maxLength": 30 },
      "username": { "type": "string"},
      "password": { "type": "string", "minimum": 18, "maximum": 99 }
    },
    "required": ["name", "username", "password"]
}

module.exports = register