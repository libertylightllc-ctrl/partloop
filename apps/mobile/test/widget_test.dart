import 'package:flutter_test/flutter_test.dart';
import 'package:partsloop_mobile/src/app.dart';

void main() {
  testWidgets('shows marketplace brand and garage', (tester) async {
    await tester.pumpWidget(const PartsLoopApp());
    expect(find.text('PartsLoop'), findsOneWidget);
    expect(find.text('Toyota Land Cruiser 2021'), findsOneWidget);
  });
}
