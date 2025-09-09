const fs = require('fs');
const path = require('path');

class Repo_DB {
    pool = null;


    setter_pool(incoming_pool) {
        this.pool = incoming_pool;
    }

    getter_pool() {
        return this.pool;
    }

}

module.exports = new Repo_DB();
