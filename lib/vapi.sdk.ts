import Vapi from '@vapi-ai/web';

export const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN!); // put ! since we sure value is neither null nor undefined



