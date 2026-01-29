export default () => ({
    port: parseInt(process.env.AUTH_PORT || '3001', 10),
});
