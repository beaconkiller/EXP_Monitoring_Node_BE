exports.test_call = async (req, res) => {
    try {
        return res.json({
            message: 'test'
        })
    }
    catch (e) {
        console.error(e.message)
        res.status(500).json({
            isSuccess: false,
            message: e.toString(),
            data: null
        })
    }
}