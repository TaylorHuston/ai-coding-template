# Document Length and Optimization Guidelines

## Optimal Length Targets

- **300-500 lines**: Ideal length for optimal AI context window processing
- **Sweet spot**: Documents that can be fully processed in a single AI context window
- **Benefits**: Manageable for human comprehension with single-topic focus

## Length Thresholds and Actions

- **~1000 lines**: **Consider splitting** - Document is approaching the limit for effective processing
- **1400 lines**: **Split required** - Document exceeds optimal AI context management
- **2000+ lines**: **Critical threshold** - Severely impacts AI performance and human usability

## When to Split Documents

Split a document when it:
- Exceeds 1000 lines and covers multiple distinct topics
- Shows AI context management issues during development
- Becomes difficult to navigate or find specific information
- Contains multiple logical sections that could stand alone

## Document Splitting Best Practices

### 1. Separate by Logical Concerns
- Split along natural topic boundaries (principles vs implementation)
- Ensure each resulting document has a clear, focused purpose
- Example: Split security guidelines into principles, authentication, and implementation

### 2. Maintain Self-Contained Documents
- Each split document should be usable independently
- Include necessary context and introductory material
- Avoid creating documents that require reading others to understand

### 3. Add Comprehensive Cross-References
- Link related split documents in "Related Guidelines" sections
- Update navigation in parent directories
- Ensure readers can easily find complementary information

### 4. Archive Original Documents
- Move original long documents to `legacy/` directory
- Create README.md in legacy directory explaining the split
- Preserve historical versions for reference and audit purposes

## Document Type Length Guidelines

- **Principles/Concepts**: 400-600 lines
- **Implementation Guides**: 800-1200 lines
- **API Specifications**: 600-900 lines
- **Quick References**: 100-300 lines
- **Index/Navigation**: 50-150 lines
- **PLAN.md files**: ~50 lines
- **README.md files**: ~200 lines