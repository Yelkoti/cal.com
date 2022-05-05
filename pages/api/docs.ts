import pjson from "@/package.json";
import modifyRes from "modify-response-middleware";
import { use } from "next-api-middleware";
import { withSwagger } from "next-swagger-doc";
import { NextApiRequest, NextApiResponse } from "next/types";

const swaggerHandler = withSwagger({
  definition: {
    openapi: "3.0.3",
    servers: [
      { url: "http://localhost:3002/v1" },
      { url: "https://api.cal.dev/v1" },
      { url: "https://api.cal.com/v1" },
    ],
    externalDocs: {
      url: "https://docs.cal.com",
      description: "Find more info at our main docs: https://docs.cal.com/",
    },
    info: {
      title: `${pjson.name}: ${pjson.description}`,
      version: pjson.version,
    },
    components: {
      securitySchemes: { ApiKeyAuth: { type: "apiKey", in: "query", name: "apiKey" } },
    },
    security: [{ ApiKeyAuth: [] }],
    tags: [
      { name: "users" },
      { name: "event-types" },
      { name: "bookings" },
      { name: "attendees" },
      { name: "payments" },
      { name: "schedules" },
      { name: "teams" },
      { name: "memberships" },
      { name: "availabilities" },
      { name: "custom-inputs" },
      { name: "event-references" },
      { name: "booking-references" },
      { name: "destination-calendars" },
      { name: "selected-calendars" },
    ],
  },
  apiFolder: "pages/api",
});

export default use(
  modifyRes((content: string, _req: NextApiRequest, res: NextApiResponse) => {
    // Add all headers here instead of next.config.js as it is throwing error( Cannot set headers after they are sent to the client) for OPTIONS method
    // It is known to happen only in Dev Mode.
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS, PATCH, DELETE, POST, PUT");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Content-Type, api_key, Authorization"
    );
    if (content) {
      const parsed = JSON.parse(content);
      // HACK: This is a hack to fix the swagger-ui issue with the extra channels property.
      delete parsed.channels;
      return Buffer.from(JSON.stringify(parsed));
    }
  })
)(swaggerHandler());
