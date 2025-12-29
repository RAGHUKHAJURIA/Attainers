/**
 * Utility function to download files using fetch API
 * This ensures proper file downloads even when the server redirects
 * @param {string} url - The download URL
 * @param {string} filename - Optional filename for the download
 */
export const downloadFile = async (url, filename = null) => {
    try {
        // Fetch the file
        const response = await fetch(url, {
            method: 'GET',
            // Important: Don't follow redirects automatically
            redirect: 'follow',
        });

        // Check if the response is ok
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Get the content type
        const contentType = response.headers.get('content-type');

        // Check if we got HTML instead of a file (common error)
        if (contentType && contentType.includes('text/html')) {
            // Try to get the response as text to see what we got
            const text = await response.text();
            console.error('Received HTML instead of file:', text.substring(0, 200));
            throw new Error('Server returned HTML instead of file. This might be a redirect or error page.');
        }

        // Get the filename from Content-Disposition header if not provided
        if (!filename) {
            const contentDisposition = response.headers.get('content-disposition');
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (filenameMatch && filenameMatch[1]) {
                    filename = filenameMatch[1].replace(/['"]/g, '');
                    // Decode URI if needed
                    try {
                        filename = decodeURIComponent(filename);
                    } catch (e) {
                        // If decoding fails, use as is
                    }
                }
            }
        }

        // Default filename if still not set
        if (!filename) {
            filename = 'download.pdf';
        }

        // Convert response to blob
        const blob = await response.blob();

        // Create a temporary URL for the blob
        const blobUrl = window.URL.createObjectURL(blob);

        // Create a temporary anchor element and trigger download
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error('Download error:', error);
        throw error;
    }
};

