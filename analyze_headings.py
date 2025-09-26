#!/usr/bin/env python3
"""
HTML Heading Hierarchy Analyzer
Analyzes HTML files to identify heading hierarchy issues.
"""

import os
import re
from pathlib import Path
from bs4 import BeautifulSoup
import json

class HeadingAnalyzer:
    def __init__(self, root_dir):
        self.root_dir = Path(root_dir)
        self.results = {
            'proper_hierarchy': [],
            'improper_hierarchy': [],
            'no_headings': [],
            'summary': {}
        }

    def extract_headings(self, html_content):
        """Extract all heading tags (h1-h6) from HTML content in order."""
        soup = BeautifulSoup(html_content, 'html.parser')
        headings = []

        # Find all heading tags in document order
        for tag in soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']):
            level = int(tag.name[1])
            text = tag.get_text().strip()
            headings.append({
                'level': level,
                'tag': tag.name,
                'text': text[:100] + ('...' if len(text) > 100 else ''),  # Truncate long text
                'full_text': text
            })

        return headings

    def check_hierarchy(self, headings):
        """Check if heading sequence follows proper hierarchy."""
        if not headings:
            return True, []  # No headings is technically proper

        issues = []
        previous_level = 0

        for i, heading in enumerate(headings):
            current_level = heading['level']

            # First heading should be h1
            if i == 0 and current_level != 1:
                issues.append({
                    'type': 'first_not_h1',
                    'position': i + 1,
                    'heading': heading,
                    'description': f"First heading is {heading['tag']}, should be h1"
                })

            # Check for skipped levels
            if current_level > previous_level + 1:
                skipped_levels = list(range(previous_level + 1, current_level))
                issues.append({
                    'type': 'skipped_levels',
                    'position': i + 1,
                    'heading': heading,
                    'previous_level': previous_level,
                    'current_level': current_level,
                    'skipped_levels': skipped_levels,
                    'description': f"Skipped from h{previous_level} to {heading['tag']}, missing levels: " +
                                 ", ".join([f"h{level}" for level in skipped_levels])
                })

            previous_level = current_level

        return len(issues) == 0, issues

    def analyze_file(self, file_path):
        """Analyze a single HTML file."""
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()

            headings = self.extract_headings(content)
            is_proper, issues = self.check_hierarchy(headings)

            relative_path = file_path.relative_to(self.root_dir)

            result = {
                'file': str(relative_path),
                'absolute_path': str(file_path),
                'headings': headings,
                'heading_sequence': [h['tag'] for h in headings],
                'heading_levels': [h['level'] for h in headings],
                'issues': issues,
                'is_proper': is_proper,
                'total_headings': len(headings)
            }

            return result

        except Exception as e:
            return {
                'file': str(file_path.relative_to(self.root_dir)),
                'absolute_path': str(file_path),
                'error': str(e),
                'is_proper': None
            }

    def analyze_all_files(self):
        """Analyze all HTML files in the directory."""
        html_files = list(self.root_dir.rglob('*.html'))
        print(f"Found {len(html_files)} HTML files to analyze...")

        for i, file_path in enumerate(html_files, 1):
            print(f"Analyzing {i}/{len(html_files)}: {file_path.name}")
            result = self.analyze_file(file_path)

            if result.get('error'):
                print(f"  Error: {result['error']}")
                continue

            if result['total_headings'] == 0:
                self.results['no_headings'].append(result)
            elif result['is_proper']:
                self.results['proper_hierarchy'].append(result)
            else:
                self.results['improper_hierarchy'].append(result)

        # Generate summary
        total_files = len(html_files)
        proper_count = len(self.results['proper_hierarchy'])
        improper_count = len(self.results['improper_hierarchy'])
        no_headings_count = len(self.results['no_headings'])

        self.results['summary'] = {
            'total_files': total_files,
            'proper_hierarchy_count': proper_count,
            'improper_hierarchy_count': improper_count,
            'no_headings_count': no_headings_count,
            'proper_percentage': round((proper_count / total_files) * 100, 1) if total_files > 0 else 0,
            'improper_percentage': round((improper_count / total_files) * 100, 1) if total_files > 0 else 0
        }

    def generate_report(self, output_file=None):
        """Generate a detailed report."""
        report = []

        # Summary
        summary = self.results['summary']
        report.append("=" * 80)
        report.append("HTML HEADING HIERARCHY ANALYSIS REPORT")
        report.append("=" * 80)
        report.append(f"Total HTML files analyzed: {summary['total_files']}")
        report.append(f"Files with proper hierarchy: {summary['proper_hierarchy_count']} ({summary['proper_percentage']}%)")
        report.append(f"Files with improper hierarchy: {summary['improper_hierarchy_count']} ({summary['improper_percentage']}%)")
        report.append(f"Files with no headings: {summary['no_headings_count']}")
        report.append("")

        # Files with improper hierarchy
        if self.results['improper_hierarchy']:
            report.append("🚫 FILES WITH IMPROPER HEADING HIERARCHY")
            report.append("=" * 60)

            for file_result in self.results['improper_hierarchy']:
                report.append(f"\nFile: {file_result['file']}")
                report.append(f"Heading sequence: {' → '.join(file_result['heading_sequence'])}")
                report.append("Issues found:")

                for issue in file_result['issues']:
                    report.append(f"  • {issue['description']}")
                    if issue['type'] == 'skipped_levels':
                        report.append(f"    Previous level: h{issue['previous_level']}, Current: {issue['heading']['tag']}")
                        report.append(f"    Heading text: \"{issue['heading']['text']}\"")

                report.append("Headings in order:")
                for i, heading in enumerate(file_result['headings'], 1):
                    report.append(f"  {i}. {heading['tag']}: \"{heading['text']}\"")

        # Files with proper hierarchy
        if self.results['proper_hierarchy']:
            report.append("\n\n✅ FILES WITH PROPER HEADING HIERARCHY")
            report.append("=" * 60)

            for file_result in self.results['proper_hierarchy']:
                sequence = ' → '.join(file_result['heading_sequence']) if file_result['heading_sequence'] else 'No headings'
                report.append(f"\nFile: {file_result['file']}")
                report.append(f"Heading sequence: {sequence}")

        # Files with no headings
        if self.results['no_headings']:
            report.append(f"\n\n📄 FILES WITH NO HEADINGS ({len(self.results['no_headings'])} files)")
            report.append("=" * 60)

            for file_result in self.results['no_headings']:
                report.append(f"• {file_result['file']}")

        report_text = '\n'.join(report)

        if output_file:
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(report_text)
            print(f"Report saved to: {output_file}")

        return report_text

    def save_detailed_results(self, output_file):
        """Save detailed results as JSON."""
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(self.results, f, indent=2, ensure_ascii=False)
        print(f"Detailed results saved to: {output_file}")

if __name__ == "__main__":
    # Set the directory to analyze
    root_directory = Path(__file__).parent

    print("Starting HTML Heading Hierarchy Analysis...")
    print(f"Root directory: {root_directory}")

    analyzer = HeadingAnalyzer(root_directory)
    analyzer.analyze_all_files()

    # Generate and print report
    report = analyzer.generate_report("heading_hierarchy_report.txt")
    print("\n" + "="*80)
    print("ANALYSIS COMPLETE - SUMMARY")
    print("="*80)
    print(report)

    # Save detailed results
    analyzer.save_detailed_results("heading_analysis_detailed.json")