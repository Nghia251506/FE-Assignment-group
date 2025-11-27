const GA4_MEASUREMENT_ID = 'G-E8L0ZZ380M'; // Thay bằng ID của anh
const GA4_API_SECRET = 'y29VVoWGSBCu2PIGSRQzzQ'; // Anh phải tạo ở GA4 Admin → Data Streams → API Secret

export const fetchGA4Data = async () => {
  const response = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_MEASUREMENT_ID.replace(
      'G-',
      ''
    )}:runReport`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Nếu anh dùng backend proxy (khuyên dùng vì bảo mật)
        // → để backend gọi GA4 thay vì frontend
      },
      body: JSON.stringify({
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'date' }],
        metrics: [{ name: 'activeUsers' }],
      }),
    }
  );

  if (!response.ok) throw new Error('GA4 API error');

  const data = await response.json();
  return data.rows?.map((row: any) => ({
    date: row.dimensionValues[0].value,
    users: parseInt(row.metricValues[0].value),
  }));
};