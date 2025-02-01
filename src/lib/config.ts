import Joi from "joi";

const schema = Joi.object({
  scheme: Joi.string().default("https"),
  host: Joi.string().required(),
  port: Joi.number().default(3000),
  authority: Joi.string().required(),
  databaseUrl: Joi.string().uri().required(),
  secret: Joi.string().required(),
});

const config = {
  scheme: process.env.SCHEME,
  host: process.env.HOST,
  port: process.env.PORT,
  authority: `${process.env.HOST}:${process.env.PORT}`,
  databaseUrl: process.env.DATABASE_URL,
  secret: process.env.SECRET,
};

const { error, value: conf } = schema.validate(config);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default conf;
