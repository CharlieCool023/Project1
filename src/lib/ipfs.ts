import axios from 'axios';

const KALEIDO_IPFS_URL = process.env.NEXT_PUBLIC_KALEIDO_IPFS_URL;
const KALEIDO_IPFS_USERNAME = process.env.NEXT_PUBLIC_KALEIDO_IPFS_USERNAME;
const KALEIDO_IPFS_PASSWORD = process.env.NEXT_PUBLIC_KALEIDO_IPFS_PASSWORD;

if (!KALEIDO_IPFS_URL || !KALEIDO_IPFS_USERNAME || !KALEIDO_IPFS_PASSWORD) {
  console.error('Kaleido IPFS configuration is incomplete. Please check your .env.local file.');
}

const axiosInstance = axios.create({
  baseURL: KALEIDO_IPFS_URL,
  auth: {
    username: KALEIDO_IPFS_USERNAME || '',
    password: KALEIDO_IPFS_PASSWORD || ''
  }
});

export async function uploadToIPFS(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post('/api/v0/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data && response.data.Hash) {
      return response.data.Hash;
    } else {
      throw new Error('Failed to upload file to IPFS: No hash returned');
    }
  } catch (error: unknown) {
    console.error('Error uploading file to IPFS:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        throw new Error(`Failed to upload file to IPFS: ${error.response.status} ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        throw new Error('Failed to upload file to IPFS: No response received');
      } else {
        throw new Error(`Failed to upload file to IPFS: ${error.message}`);
      }
    } else if (error instanceof Error) {
      throw new Error(`Failed to upload file to IPFS: ${error.message}`);
    } else {
      throw new Error('Failed to upload file to IPFS: Unknown error');
    }
  }
}

export function getIPFSImageUrl(hash: string): string {
  return `${KALEIDO_IPFS_URL}/ipfs/${hash}?dl=1`;
}

