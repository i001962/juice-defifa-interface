import { create } from "ipfs-http-client";

// IPFS configuration from environment variables
const projectId = process.env.IPFS_PROJECT_ID;
const projectSecret = process.env.IPFS_PROJECT_SECRET;
const host = process.env.IPFS_GATEWAY_HOST || "ipfs.infura.io";
const port = parseInt(process.env.IPFS_GATEWAY_PORT || "5001");
const protocol = process.env.IPFS_GATEWAY_PROTOCOL || "https";

if (!projectId || !projectSecret) {
  throw new Error("IPFS_PROJECT_ID and IPFS_PROJECT_SECRET environment variables are required");
}

const authorization = "Basic " + btoa(projectId + ":" + projectSecret);

const ipfs = create({
  host,
  port,
  protocol,
  headers: {
    authorization: authorization,
  },
});

export async function uploadToIPFS(file: File) {
  if (!file) {
    console.error("No file selected");
    return;
  }

  try {
    const { path } = await ipfs.add(file);
    return path;
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}

export async function uploadJsonToIpfs(jsonData: { [k: string]: unknown }) {
  try {
    // Convert the JSON data to a Buffer
    const buffer = Buffer.from(JSON.stringify(jsonData));

    // Add the JSON file to IPFS
    const result = await ipfs.add(buffer);

    // Get the CID of the uploaded JSON file
    const cid = result.path;

    return cid;
  } catch (error) {
    console.error("Error uploading JSON file to IPFS:", error);
  }
}
