import 'package:flutter/material.dart';

enum PartCondition { newPart, used, refurbished }
enum CompatibilityStatus { confirmed, possible, unverified }

class Product {
  const Product({
    required this.id,
    required this.title,
    required this.titleAr,
    required this.oem,
    required this.price,
    required this.condition,
    required this.compatibility,
    required this.symbol,
    required this.imageUrl,
  });

  final String id;
  final String title;
  final String titleAr;
  final String oem;
  final int price;
  final PartCondition condition;
  final CompatibilityStatus compatibility;
  final IconData symbol;
  final String imageUrl;
}

const demoProducts = <Product>[
  Product(
    id: 'prd_headlight',
    title: 'Land Cruiser LED Headlight — Left',
    titleAr: 'مصباح ليد يسار لاند كروزر',
    oem: '81150-60R30',
    price: 850,
    condition: PartCondition.used,
    compatibility: CompatibilityStatus.confirmed,
    symbol: Icons.light_mode_outlined,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/LED_Headlamp_inside.jpg',
  ),
  Product(
    id: 'prd_engine',
    title: 'Nissan Patrol VK56 5.6L Engine',
    titleAr: 'محرك نيسان باترول VK56',
    oem: 'VK56VD',
    price: 12800,
    condition: PartCondition.used,
    compatibility: CompatibilityStatus.possible,
    symbol: Icons.settings_outlined,
    imageUrl: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=900&q=82',
  ),
  Product(
    id: 'prd_mirror',
    title: 'Lexus LX570 Right Mirror',
    titleAr: 'مرآة يمين لكزس LX570',
    oem: '87910-60D80',
    price: 1190,
    condition: PartCondition.refurbished,
    compatibility: CompatibilityStatus.confirmed,
    symbol: Icons.motion_photos_on_outlined,
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=82',
  ),
  Product(
    id: 'prd_wheel',
    title: 'Range Rover Sport 22-inch Wheel',
    titleAr: 'رنج روفر جنط 22 بوصة',
    oem: 'LR099138',
    price: 975,
    condition: PartCondition.used,
    compatibility: CompatibilityStatus.unverified,
    symbol: Icons.album_outlined,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Alumwheel.jpg',
  ),
];
