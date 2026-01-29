export default () => ({
    port: parseInt(process.env.USER_PORT || '3002', 10),
});
