import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'models.dart';
import 'repository.dart';

const _navy = Color(0xFF10243E);
const _mint = Color(0xFF00A789);
const _canvas = Color(0xFFF4F7F7);
const _amber = Color(0xFFFFCF3E);

class PartsLoopApp extends StatefulWidget {
  const PartsLoopApp({super.key});

  @override
  State<PartsLoopApp> createState() => _PartsLoopAppState();
}

class _PartsLoopAppState extends State<PartsLoopApp> {
  Locale _locale = const Locale('en');

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'PartsLoop',
      debugShowCheckedModeBanner: false,
      locale: _locale,
      supportedLocales: const [Locale('en'), Locale('ar')],
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: _mint,
          primary: _mint,
          secondary: _amber,
          surface: Colors.white,
        ),
        scaffoldBackgroundColor: _canvas,
        fontFamily: 'sans-serif',
        cardTheme: const CardTheme(
          color: Colors.white,
          elevation: 0,
          margin: EdgeInsets.zero,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.all(Radius.circular(18)),
          ),
        ),
        filledButtonTheme: FilledButtonThemeData(
          style: FilledButton.styleFrom(
            minimumSize: const Size.fromHeight(50),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
        ),
      ),
      home: MarketplaceShell(
        locale: _locale,
        onLocaleChanged: () => setState(() {
          _locale = _locale.languageCode == 'en'
              ? const Locale('ar')
              : const Locale('en');
        }),
      ),
    );
  }
}

class MarketplaceShell extends StatefulWidget {
  const MarketplaceShell({
    required this.locale,
    required this.onLocaleChanged,
    super.key,
  });

  final Locale locale;
  final VoidCallback onLocaleChanged;

  @override
  State<MarketplaceShell> createState() => _MarketplaceShellState();
}

class _MarketplaceShellState extends State<MarketplaceShell> {
  int _index = 0;
  final MarketplaceRepository _repository = MockMarketplaceRepository();
  final List<Product> _cart = [];

  @override
  Widget build(BuildContext context) {
    final ar = widget.locale.languageCode == 'ar';
    final pages = <Widget>[
      HomeScreen(
        ar: ar,
        repository: _repository,
        onOpen: _openProduct,
        onLocaleChanged: widget.onLocaleChanged,
      ),
      SearchScreen(ar: ar, repository: _repository, onOpen: _openProduct),
      SellerScreen(ar: ar),
      OrdersScreen(ar: ar),
      AccountScreen(ar: ar),
    ];
    return Scaffold(
      body: IndexedStack(index: _index, children: pages),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: (value) => setState(() => _index = value),
        destinations: [
          NavigationDestination(icon: const Icon(Icons.home_outlined), selectedIcon: const Icon(Icons.home), label: ar ? 'الرئيسية' : 'Home'),
          NavigationDestination(icon: const Icon(Icons.search), label: ar ? 'بحث' : 'Search'),
          NavigationDestination(icon: const Icon(Icons.add_circle_outline), label: ar ? 'بيع' : 'Sell'),
          NavigationDestination(icon: const Icon(Icons.local_shipping_outlined), label: ar ? 'الطلبات' : 'Orders'),
          NavigationDestination(icon: const Icon(Icons.person_outline), label: ar ? 'الحساب' : 'Account'),
        ],
      ),
    );
  }

  void _openProduct(Product product) {
    Navigator.of(context).push(MaterialPageRoute<void>(
      builder: (_) => ProductScreen(
        product: product,
        ar: widget.locale.languageCode == 'ar',
        onAdd: () => setState(() => _cart.add(product)),
      ),
    ));
  }
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({
    required this.ar,
    required this.repository,
    required this.onOpen,
    required this.onLocaleChanged,
    super.key,
  });

  final bool ar;
  final MarketplaceRepository repository;
  final ValueChanged<Product> onOpen;
  final VoidCallback onLocaleChanged;

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        SliverAppBar(
          floating: true,
          backgroundColor: Colors.white,
          title: const _Brand(),
          actions: [
            TextButton(onPressed: onLocaleChanged, child: Text(ar ? 'English' : 'العربية')),
            IconButton(onPressed: () {}, icon: const Icon(Icons.shopping_bag_outlined)),
          ],
          bottom: PreferredSize(
            preferredSize: const Size.fromHeight(70),
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 14),
              child: SearchBar(
                hintText: ar ? 'ابحث بالقطعة أو OEM أو VIN' : 'Part, OEM, VIN or vehicle',
                leading: const Icon(Icons.search),
                trailing: const [Icon(Icons.photo_camera_outlined)],
                onTap: () {},
              ),
            ),
          ),
        ),
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                _GarageCard(ar: ar),
                const SizedBox(height: 24),
                Text(ar ? 'تسوق حسب الفئة' : 'Shop by category', style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w800)),
                const SizedBox(height: 12),
                const _CategoryStrip(),
                const SizedBox(height: 26),
                Text(ar ? 'مقترحة لسيارتك' : 'Recommended for your car', style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w800)),
                const SizedBox(height: 12),
              ],
            ),
          ),
        ),
        FutureBuilder<List<Product>>(
          future: repository.search(''),
          builder: (context, snapshot) {
            final products = snapshot.data ?? demoProducts;
            return SliverPadding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 30),
              sliver: SliverGrid.builder(
                itemCount: products.length,
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  mainAxisSpacing: 12,
                  crossAxisSpacing: 12,
                  childAspectRatio: .68,
                ),
                itemBuilder: (_, index) => ProductTile(product: products[index], ar: ar, onTap: () => onOpen(products[index])),
              ),
            );
          },
        ),
      ],
    );
  }
}

class _Brand extends StatelessWidget {
  const _Brand();
  @override
  Widget build(BuildContext context) {
    return const Row(children: [
      DecoratedBox(
        decoration: BoxDecoration(color: _mint, borderRadius: BorderRadius.all(Radius.circular(10))),
        child: Padding(padding: EdgeInsets.symmetric(horizontal: 10, vertical: 6), child: Text('P', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900))),
      ),
      SizedBox(width: 8),
      Text('PartsLoop', style: TextStyle(color: _navy, fontWeight: FontWeight.w900, letterSpacing: -1)),
    ]);
  }
}

class _GarageCard extends StatelessWidget {
  const _GarageCard({required this.ar});
  final bool ar;
  @override
  Widget build(BuildContext context) {
    return Card(
      color: _navy,
      child: Padding(
        padding: const EdgeInsets.all(18),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(ar ? 'كراجي' : 'MY GARAGE', style: const TextStyle(color: Color(0xFF91A8B9), fontSize: 11, fontWeight: FontWeight.w800)),
          const SizedBox(height: 7),
          const Text('Toyota Land Cruiser 2021', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w800)),
          const Text('4.0L V6 • GXR', style: TextStyle(color: Color(0xFFB9C8D2))),
          const SizedBox(height: 15),
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(color: const Color(0xFF173B56), borderRadius: BorderRadius.circular(10)),
            child: Row(children: [
              const Icon(Icons.verified_outlined, color: _amber),
              const SizedBox(width: 8),
              Expanded(child: Text(ar ? 'اعرض القطع المتوافقة فقط' : 'Show confirmed-fit parts first', style: const TextStyle(color: Colors.white, fontSize: 12))),
              const Icon(Icons.chevron_right, color: Colors.white),
            ]),
          ),
        ]),
      ),
    );
  }
}

class _CategoryStrip extends StatelessWidget {
  const _CategoryStrip();
  @override
  Widget build(BuildContext context) {
    const values = [
      (Icons.settings_outlined, 'Engines', Color(0xFFDFF2FF)),
      (Icons.light_mode_outlined, 'Lights', Color(0xFFFFF2CD)),
      (Icons.directions_car_outlined, 'Body', Color(0xFFDCF8EF)),
      (Icons.album_outlined, 'Wheels', Color(0xFFFFE6E9)),
    ];
    return SizedBox(
      height: 95,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: values.length,
        separatorBuilder: (_, __) => const SizedBox(width: 10),
        itemBuilder: (_, index) => Container(
          width: 92,
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(color: values[index].$3, borderRadius: BorderRadius.circular(15)),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
            Icon(values[index].$1, color: _navy),
            Text(values[index].$2, style: const TextStyle(fontWeight: FontWeight.w800)),
          ]),
        ),
      ),
    );
  }
}

class ProductTile extends StatelessWidget {
  const ProductTile({required this.product, required this.ar, required this.onTap, super.key});
  final Product product;
  final bool ar;
  final VoidCallback onTap;
  @override
  Widget build(BuildContext context) {
    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Expanded(child: Image.network(
            product.imageUrl,
            width: double.infinity,
            fit: BoxFit.cover,
            errorBuilder: (_, __, ___) => Container(color: const Color(0xFFE2E9EB), child: Center(child: Icon(product.symbol, size: 58, color: const Color(0xFF29485C)))),
          )),
          Padding(
            padding: const EdgeInsets.all(10),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(ar ? product.titleAr : product.title, maxLines: 2, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.w800)),
              const SizedBox(height: 4),
              Text('OEM ${product.oem}', style: const TextStyle(fontSize: 10, color: Colors.grey)),
              const SizedBox(height: 7),
              Text('AED ${product.price}', style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w900)),
              const SizedBox(height: 6),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 4),
                decoration: BoxDecoration(color: product.compatibility == CompatibilityStatus.confirmed ? const Color(0xFFDCF8EF) : const Color(0xFFFFF2CD), borderRadius: BorderRadius.circular(5)),
                child: Text(product.compatibility == CompatibilityStatus.confirmed ? (ar ? '✓ توافق مؤكد' : '✓ Confirmed fit') : (ar ? 'توافق محتمل' : 'Possible fit'), style: const TextStyle(fontSize: 9, fontWeight: FontWeight.w800)),
              ),
            ]),
          ),
        ]),
      ),
    );
  }
}

class ProductScreen extends StatelessWidget {
  const ProductScreen({required this.product, required this.ar, required this.onAdd, super.key});
  final Product product;
  final bool ar;
  final VoidCallback onAdd;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const _Brand(), backgroundColor: Colors.white),
      body: ListView(padding: const EdgeInsets.all(16), children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(20),
          child: Image.network(
            product.imageUrl,
            height: 300,
            width: double.infinity,
            fit: BoxFit.cover,
            errorBuilder: (_, __, ___) => Container(height: 300, color: const Color(0xFFE2E9EB), child: Icon(product.symbol, size: 120, color: const Color(0xFF29485C))),
          ),
        ),
        const SizedBox(height: 20),
        Text(ar ? product.titleAr : product.title, style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.w900)),
        const SizedBox(height: 7),
        Text('OEM ${product.oem}', style: const TextStyle(color: Colors.grey)),
        const SizedBox(height: 14),
        Text('AED ${product.price}', style: const TextStyle(fontSize: 30, fontWeight: FontWeight.w900)),
        const SizedBox(height: 18),
        Card(color: const Color(0xFFECFAF6), child: Padding(padding: const EdgeInsets.all(16), child: Row(children: [
          const Icon(Icons.verified, color: _mint),
          const SizedBox(width: 10),
          Expanded(child: Text(ar ? 'توافق مؤكد مع لاند كروزر 2021' : 'Confirmed fit for your Land Cruiser 2021', style: const TextStyle(fontWeight: FontWeight.w800))),
        ]))),
        const SizedBox(height: 12),
        FilledButton(onPressed: () { onAdd(); ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(ar ? 'أضيفت للسلة' : 'Added to cart'))); }, child: Text(ar ? 'أضف إلى السلة' : 'Add to cart')),
        const SizedBox(height: 8),
        OutlinedButton.icon(onPressed: () {}, icon: const Icon(Icons.shield_outlined), label: Text(ar ? 'الدفع محمي حتى الفحص' : 'Protected until inspection ends')),
      ]),
    );
  }
}

class SearchScreen extends StatefulWidget {
  const SearchScreen({required this.ar, required this.repository, required this.onOpen, super.key});
  final bool ar;
  final MarketplaceRepository repository;
  final ValueChanged<Product> onOpen;
  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  List<Product> results = demoProducts;
  @override
  Widget build(BuildContext context) {
    return SafeArea(child: Padding(padding: const EdgeInsets.all(16), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(widget.ar ? 'ابحث عن قطعة' : 'Find a part', style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.w900)),
      const SizedBox(height: 12),
      SearchBar(leading: const Icon(Icons.search), hintText: widget.ar ? 'اسم القطعة أو OEM أو VIN' : 'Part, OEM, VIN or vehicle', onChanged: (value) async { final next = await widget.repository.search(value); if (mounted) setState(() => results = next); }),
      const SizedBox(height: 16),
      Expanded(child: GridView.builder(itemCount: results.length, gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 2, mainAxisSpacing: 12, crossAxisSpacing: 12, childAspectRatio: .68), itemBuilder: (_, index) => ProductTile(product: results[index], ar: widget.ar, onTap: () => widget.onOpen(results[index])))),
    ])));
  }
}

class SellerScreen extends StatelessWidget {
  const SellerScreen({required this.ar, super.key});
  final bool ar;
  @override
  Widget build(BuildContext context) {
    return SafeArea(child: ListView(padding: const EdgeInsets.all(16), children: [
      Text(ar ? 'بيع قطعة' : 'Sell a part', style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.w900)),
      Text(ar ? 'أنشئ إعلاناً كاملاً في أقل من دقيقة.' : 'Create a complete listing in under a minute.', style: const TextStyle(color: Colors.grey)),
      const SizedBox(height: 22),
      Card(color: _navy, child: Padding(padding: const EdgeInsets.all(22), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const Icon(Icons.auto_awesome, color: _amber, size: 38),
        const SizedBox(height: 18),
        Text(ar ? 'مساعد الإعلان بالذكاء الاصطناعي' : 'AI listing assistant', style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.w900)),
        const SizedBox(height: 8),
        Text(ar ? 'صوّر القطعة لقراءة OEM واقتراح التوافق والسعر والوصف.' : 'Photograph the part to read OEM, suggest fitment, price, and bilingual copy.', style: const TextStyle(color: Color(0xFFBACBD6))),
        const SizedBox(height: 18),
        FilledButton.icon(onPressed: () {}, icon: const Icon(Icons.camera_alt_outlined), label: Text(ar ? 'ابدأ بالصور' : 'Start with photos')),
      ]))),
      const SizedBox(height: 18),
      const _SellerMetric(label: 'Active listings', value: '312', icon: Icons.inventory_2_outlined),
      const SizedBox(height: 10),
      const _SellerMetric(label: 'Protected balance', value: 'AED 4,250', icon: Icons.shield_outlined),
      const SizedBox(height: 10),
      const _SellerMetric(label: 'Available payout', value: 'AED 2,800', icon: Icons.account_balance_wallet_outlined),
    ]));
  }
}

class _SellerMetric extends StatelessWidget {
  const _SellerMetric({required this.label, required this.value, required this.icon});
  final String label;
  final String value;
  final IconData icon;
  @override
  Widget build(BuildContext context) => Card(child: ListTile(leading: Icon(icon, color: _mint), title: Text(label), trailing: Text(value, style: const TextStyle(fontWeight: FontWeight.w900))));
}

class OrdersScreen extends StatelessWidget {
  const OrdersScreen({required this.ar, super.key});
  final bool ar;
  @override
  Widget build(BuildContext context) {
    const steps = ['Payment secured', 'Seller confirmed', 'Part packed', 'Courier collected', 'Delivered', '48-hour inspection', 'Seller payout'];
    return SafeArea(child: ListView(padding: const EdgeInsets.all(16), children: [
      Text(ar ? 'تتبع الطلب' : 'Track order', style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.w900)),
      const Text('PL-10482 • MOCK-AE-884201', style: TextStyle(color: Colors.grey)),
      const SizedBox(height: 18),
      Card(child: Padding(padding: const EdgeInsets.all(18), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const Text('Delivered — inspection in progress', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900)),
        const SizedBox(height: 6),
        const Text('31h 42m remaining', style: TextStyle(color: _mint, fontWeight: FontWeight.w800)),
        const Divider(height: 28),
        ...List.generate(steps.length, (index) => ListTile(contentPadding: EdgeInsets.zero, dense: true, leading: CircleAvatar(radius: 13, backgroundColor: index < 5 ? _mint : Colors.white, child: index < 5 ? const Icon(Icons.check, size: 14, color: Colors.white) : Text(index == 5 ? '•' : '', style: const TextStyle(color: _mint))), title: Text(steps[index], style: TextStyle(fontWeight: index == 5 ? FontWeight.w900 : FontWeight.w600)))),
        const SizedBox(height: 8),
        FilledButton(onPressed: () {}, child: Text(ar ? 'كل شيء صحيح' : 'Everything is correct')),
        TextButton(onPressed: () {}, child: Text(ar ? 'الإبلاغ عن مشكلة' : 'Report a problem')),
      ]))),
    ]));
  }
}

class AccountScreen extends StatelessWidget {
  const AccountScreen({required this.ar, super.key});
  final bool ar;
  @override
  Widget build(BuildContext context) => SafeArea(child: ListView(padding: const EdgeInsets.all(16), children: [
    Text(ar ? 'الحساب' : 'Account', style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.w900)),
    const SizedBox(height: 18),
    const Card(child: ListTile(leading: CircleAvatar(backgroundColor: _navy, child: Text('O', style: TextStyle(color: Colors.white))), title: Text('Omar Khalid'), subtitle: Text('Buyer • Dubai'), trailing: Icon(Icons.chevron_right))),
    const SizedBox(height: 12),
    Card(child: Column(children: [
      ListTile(leading: const Icon(Icons.directions_car_outlined), title: Text(ar ? 'كراجي' : 'My garage'), trailing: const Icon(Icons.chevron_right)),
      const Divider(height: 1),
      ListTile(leading: const Icon(Icons.location_on_outlined), title: Text(ar ? 'العناوين' : 'Addresses'), trailing: const Icon(Icons.chevron_right)),
      const Divider(height: 1),
      ListTile(leading: const Icon(Icons.help_outline), title: Text(ar ? 'المساعدة' : 'Help & disputes'), trailing: const Icon(Icons.chevron_right)),
    ])),
  ]));
}
