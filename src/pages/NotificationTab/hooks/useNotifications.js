import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../../../contexts/UserContext';
import { BASE_URL } from '../../../utils/urls'

export const useNotifications = (cpf) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { authToken } = useUser();

  console.log("BASE_URL: ", BASE_URL)

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/api/notifications/responsavel/${cpf}`, { headers: { Authorization: authToken}});
        if (response.data.isOk) {
          setNotifications(response.data.contentResponse);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [cpf]);

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/notifications/${id}`, { headers: { Authorization: authToken}});
      setNotifications((prev) => prev.filter((notification) => notification.id_notificacao !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return { notifications, loading, error, deleteNotification };

};
