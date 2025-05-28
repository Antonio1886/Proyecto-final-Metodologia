// js/store.js

// Obtener todos los productos
async function fetchProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*');

  if (error) {
    console.error('Error al obtener productos:', error.message);
    return [];
  } else {
    return data;
  }
}

// Agregar un nuevo producto
async function addProduct(product) {
  const user = supabase.auth.user();
  if (!user) {
    console.warn('Debes iniciar sesión para agregar productos');
    return;
  }

  const { data, error } = await supabase
    .from('products')
    .insert([
      {
        name: product.name,
        description: product.description,
        price: product.price,
        image_url: product.image_url,
        created_by: user.id,
      },
    ]);

  if (error) {
    console.error('Error al agregar producto:', error.message);
  } else {
    console.log('Producto agregado:', data);
  }
}

// Actualizar un producto existente
async function updateProduct(id, updates) {
  const user = supabase.auth.user();
  if (!user) {
    console.warn('Debes iniciar sesión para actualizar productos');
    return;
  }

  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .eq('created_by', user.id); // Solo puedes modificar tus propios productos

  if (error) {
    console.error('Error al actualizar producto:', error.message);
  } else {
    console.log('Producto actualizado:', data);
  }
}

// Eliminar un producto existente
async function deleteProduct(id) {
  const user = supabase.auth.user();
  if (!user) {
    console.warn('Debes iniciar sesión para eliminar productos');
    return;
  }

  const { data, error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
    .eq('created_by', user.id); // Solo puedes eliminar tus propios productos

  if (error) {
    console.error('Error al eliminar producto:', error.message);
  } else {
    console.log('Producto eliminado:', data);
  }
}
