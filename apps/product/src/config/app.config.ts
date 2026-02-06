export default () => ({
    port: parseInt(process.env.PRODUCT_PORT || '3004', 10),
});
