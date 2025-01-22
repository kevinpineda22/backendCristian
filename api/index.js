// /api/index.js

export default function handler(req, res) {
    res.status(200).json({ message: '♥ Corriendo parchaito ♥', timestamp: new Date() });
  }
  