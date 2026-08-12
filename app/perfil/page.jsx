'use client'
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/storage';

const REGIONES = ['Lima', 'Junin', 'Arequipa', 'Cusco', 'Piura', 'La Libertad', 'Loreto', 'Ucayali', 'San Martin', 'Ayacucho'];

const perfilSchema = z.object({
  nombre: z.string().max(60).optional(),
  region: z.string().optional(),
});

export default function Perfil() {
  const router = useRouter();

  const {register, handleSubmit, formState: {errors}} = useForm({
    resolver: zodResolver(perfilSchema),
  });
  
  const onSubmit = (data) => {
    storage.set(storage.keys.PERFIL, {
      nombre: data.nombre.trim() || null,
      region: data.region || null,
    });
    router.push('/test');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="text" placeholder="Nombre" {...register('nombre')}/>
      <select {...register('region')}>
        <option value="">Prefiero no decirlo</option>
        {REGIONES.map((region) => <option key={region} value={region}>{region}</option>)}
      </select>
      <button type="submit">Guardar</button>
    </form>
  );

}