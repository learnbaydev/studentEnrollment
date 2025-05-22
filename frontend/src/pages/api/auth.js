import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { token } = req.body;

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google/callback`, {
        token,
      });

      if (response.data) {
        res.status(200).json({ success: true });
      } else {
        res.status(401).json({ success: false });
      }
    } catch (error) {
      console.error("Error authenticating with backend:", error);
      res.status(500).json({ success: false });
    }
  } else {
    res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}
