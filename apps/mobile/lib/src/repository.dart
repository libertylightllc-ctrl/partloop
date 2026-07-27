import 'dart:convert';
import 'dart:io';
import 'models.dart';

abstract interface class MarketplaceRepository {
  Future<List<Product>> search(String query);
  Future<String> createProtectedOrder(String productId);
}

class MockMarketplaceRepository implements MarketplaceRepository {
  @override
  Future<List<Product>> search(String query) async {
    await Future<void>.delayed(const Duration(milliseconds: 250));
    if (query.trim().isEmpty) return demoProducts;
    final needle = query.toLowerCase();
    return demoProducts
        .where((part) =>
            part.title.toLowerCase().contains(needle) ||
            part.titleAr.contains(query) ||
            part.oem.toLowerCase().contains(needle))
        .toList();
  }

  @override
  Future<String> createProtectedOrder(String productId) async {
    await Future<void>.delayed(const Duration(milliseconds: 500));
    return 'PL-10482';
  }
}

class PartsLoopApiRepository implements MarketplaceRepository {
  PartsLoopApiRepository(this.baseUrl);
  final Uri baseUrl;

  @override
  Future<List<Product>> search(String query) async {
    final client = HttpClient();
    try {
      final request = await client.getUrl(
        baseUrl.resolve('/api/search?q=${Uri.encodeQueryComponent(query)}'),
      );
      final response = await request.close();
      if (response.statusCode != 200) throw HttpException('Search failed');
      final body = jsonDecode(await response.transform(utf8.decoder).join())
          as Map<String, dynamic>;
      // The production DTO mapper belongs here; the local mock keeps the first
      // Flutter run independent of any paid or hosted service.
      return body['data'] is List ? demoProducts : <Product>[];
    } finally {
      client.close();
    }
  }

  @override
  Future<String> createProtectedOrder(String productId) async {
    throw UnimplementedError('Call /api/checkout with a delivery address.');
  }
}
