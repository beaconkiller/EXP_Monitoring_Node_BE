function set_response(isSuccess, message, data) {
    var response = {
        isSuccess,
        message,
        data
    }
    return response;
}

module.exports = {
    set_response
}