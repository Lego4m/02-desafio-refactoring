import { useEffect, useState } from 'react';

import { Header } from '../../components/Header';
import { Food } from '../../components/Food';
import { ModalAddFood } from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

import { api } from '../../services/api';
import { FoodProduct, FoodProductInput } from '../../types';

export function Dashboard() {
  const [foods, setFoods] = useState<FoodProduct[]>([]);
  const [editingFood, setEditingFood] = useState<FoodProduct>({} as FoodProduct);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods() {
      const response = await api.get<FoodProduct[]>('/foods');

      setFoods(response.data);
    }

    loadFoods();
  }, []);

  async function handleAddFood(food: FoodProductInput) {
    try {
      const response = await api.post<FoodProduct>('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data])
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: FoodProductInput) {
    try {
      const foodUpdated = await api.put<FoodProduct>(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food }
      );

      const foodsUpdated = foods.map((f) => 
        f.id !== foodUpdated.data.id ? f : foodUpdated.data
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter((food) => food.id !== id);

    setFoods(foodsFiltered);
  }

  function toggleModal() {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal() {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: FoodProduct) {
    setEditingFood(food);
    setEditModalOpen(true);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};
