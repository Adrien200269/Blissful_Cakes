const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  rating: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'products'
});

if (require.main === module) {
  (async () => {
    await sequelize.sync();
    const products = [
      {
        name: 'Chocolate Cupcakes',
        price: 100,
        image: 'https://imgs.search.brave.com/YqcuC94aeLsCGr6er44Xiuljg1zv0d9wt8n5Z66boAM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNDkx/Nzg3Mjc3L3Bob3Rv/L2ljaW5nLWN1cGNh/a2VzLmpwZz9zPTYx/Mng2MTImdz0wJms9/MjAmYz12QUlyVHJl/ZEdwMFJWVFVPem9H/ZFVWZEJDcjZTcFhn/eWQ4UzlpWFZqQ0Fr/PQ',
        rating: 4.8,
        category: 'Cupcakes',
        description: 'Rich chocolate cupcakes'
      },
      {
        name: 'Chocolate Fudge Cake',
        price: 800,
        image: 'https://imgs.search.brave.com/fXK4V7ejh8NoQRhbvM2tAR0HcfJrQ_nUvihbNzzbgDE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTIx/Nzg5NTE2NS9waG90/by9wb3VyaW5nLWNo/b2NvbGF0ZS1pY2lu/Zy1vbi10aGUtY2Fr/ZS5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9YmtBbUJLVjZf/dTlUUFo4Zm9pTmo2/WExBNWItbzV1YV9Q/NWU2aEQwM0Z3TT0',
        rating: 4.9,
        category: 'Cakes',
        description: 'Rich chocolate cake with fudge frosting'
      },
      {
        name: 'Double Chocolate Brownies',
        price: 1000,
        image: 'https://i.ibb.co/23BSPh8m/IMG-20250608-WA0006.jpg',
        rating: 4.7,
        category: 'Brownies',
        description: 'Rich fudgy brownies'
      },
      {
        name: 'Red Velvet Cake',
        price: 1000,
        image: 'https://imgs.search.brave.com/kPumdg61p7Qr5CQBN60PU51gp4s0ut0Fvm4KGMwW2-w/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWdj/ZG4uZmxvd2VyYXVy/YS5jb20vRFNDXzMw/MDYuanBn',
        rating: 4.9,
        category: 'Cakes',
        description: 'Traditional red velvet with cream cheese frosting'
      },
      {
        name: 'Strawberry Cupcakes',
        price: 100,
        image: 'https://imgs.search.brave.com/7wBN-MXCUZoEiUVcSI39zn87_N6QhJVQMrLZENJ7NCY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuaW1tZWRpYXRl/LmNvLnVrL3Byb2R1/Y3Rpb24vdm9sYXRp/bGUvc2l0ZXMvMzAv/MjAyMC8wOC9zdHJh/d2JlcnJ5LWN1cGNh/a2VzLWY1ZjNkMzEu/anBnP3F1YWxpdHk9/OTAmcmVzaXplPTQ0/MCw0MDA',
        rating: 4.8,
        category: 'Cupcakes',
        description: 'Fresh strawberry cupcakes'
      },
      {
        name: 'Vanilla Cupcakes',
        price: 100,
        image: 'https://imgs.search.brave.com/WvrvoqonalGkK1arh2N4r8G6_Jvdhoz89qwc_wILhMY/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cmVjaXBldGluZWF0/cy5jb20vdGFjaHlv/bi8yMDIwLzA5L0Zs/dWZmeS1WYW5pbGxh/LUZyb3N0aW5nX0xl/c3MtU3dlZXRfRXJt/aW5lLUZyb3N0aW5n/XzEtd2hpdGUuanBn',
        rating: 4.6,
        category: 'Cupcakes',
        description: 'Classic vanilla cupcakes'
      },
      {
        name: 'Vanilla Dream Cake',
        price: 750,
        image: 'https://i.ibb.co/QFK1h58H/IMG-20250608-WA0003-removebg-preview.png',
        rating: 4.8,
        category: 'Cakes',
        description: 'Classic vanilla cake with buttercream'
      },
      {
        name: 'Walnut Brownies',
        price: 1200,
        image: 'https://imgs.search.brave.com/B5xUaUO0MFN1IEUwUnMGea1DAE1w4YOXViscLdb1UcA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly92aW50/YWdla2l0Y2hlbm5v/dGVzLmNvbS93cC1j/b250ZW50L3VwbG9h/ZHMvMjAxNy8xMC9X/YWxudXQtYnJvd25p/ZXMtYmF0dGVyLWlu/LWEtc3F1YXJlLXBh/bi5qcGVn',
        rating: 4.7,
        category: 'Brownies',
        description: 'Brownies with crunchy walnuts'
      }
    ];
    for (const product of products) {
      await Product.findOrCreate({
        where: { name: product.name },
        defaults: product
      });
    }
    console.log('Products inserted or already exist.');
    process.exit();
  })();
}

module.exports = Product;
