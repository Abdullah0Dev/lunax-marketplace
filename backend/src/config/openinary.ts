interface OpeninaryConfig {
  baseUrl: string;
  apiKey: string;
}

// You'll get these from your Openinary setup page
// Visit: http://tools-openinary-8f358f-173-249-22-222.traefik.me/setup
const config: OpeninaryConfig = {
  baseUrl: process.env.OPENINARY_BASE_URL || "http://tools-openinary-8f358f-173-249-22-222.traefik.me",
  apiKey: process.env.OPENINARY_API_KEY  || `yIdnqattAgSFLTsEGBQSCCLAAZzbCBhBZOFLkOEnmrNFEletqBBLSsnwgMgjDPvm`
};

export default config;