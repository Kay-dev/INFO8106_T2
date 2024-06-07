const app = require('./app');
const logger = require('./utils/logger');
const config = require('./utils/config');


const port = config.PORT || 3000
app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
})