# Next.js 16 Route Params Update Required

Next.js 16 requires route params to be awaited. All route handlers with dynamic segments need to be updated:

Change from:
```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id
```

To:
```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
```

This affects all routes in app/api with dynamic segments like [id], [slug], [category], [city], etc.

