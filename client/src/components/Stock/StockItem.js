// client/src/components/Stock/StockItem.js
import { useState } from 'react';
import axios from 'axios';
import Button from '../common/Button';
import Modal from '../common/Modal';

const StockItem = ({ item, onUpdate, onDelete }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { register, handleSubmit } = useForm({
    defaultValues: item
  });

  const submitHandler = async (data) => {
    try {
      const res = await axios.put(`/api/stock/${item._id}`, data);
      onUpdate(res.data);
      setIsEditOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <tr className="hover:bg-gray-50">
        <td className="px-6 py-4">{item.itemName}</td>
        <td className="px-6 py-4">
          <span className={`px-2 py-1 text-xs rounded-full ${
            item.type === 'purchase' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
          }`}>
            {item.type}
          </span>
        </td>
        <td className="px-6 py-4">{item.vendorName}</td>
        <td className="px-6 py-4">{item.quantity}</td>
        <td className="px-6 py-4">${item.unitPrice}</td>
        <td className="px-6 py-4">${item.totalAmount}</td>
        <td className="px-6 py-4 flex gap-2">
          <Button variant="outline" onClick={() => setIsEditOpen(true)}>Edit</Button>
          <Button variant="danger" onClick={() => onDelete(item._id)}>Delete</Button>
        </td>
      </tr>

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Stock Item">
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
          {/* Add form fields similar to AddStock */}
        </form>
      </Modal>
    </>
  );
};

export default StockItem;