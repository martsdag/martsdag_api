import { app } from './app';

const port = process.env.PORT;
const domainName = process.env.DOMAIN_NAME;

app.listen(port, () => {
  console.log(`http://${domainName}:${port}`);
});
