#!/usr/bin/env node

/**
 * 包大小分析脚本
 * 分析构建产物的大小和压缩效果
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.join(__dirname, '../dist')

// 格式化文件大小
function formatSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`
}

// 获取文件大小
function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath)
    return stats.size
  } catch (error) {
    return 0
  }
}

// 分析文件
function analyzeFile(fileName) {
  const filePath = path.join(distDir, fileName)
  const size = getFileSize(filePath)

  if (size === 0) {
    return null
  }

  const gzPath = `${filePath}.gz`
  const brPath = `${filePath}.br`

  const gzSize = getFileSize(gzPath)
  const brSize = getFileSize(brPath)

  return {
    fileName,
    size,
    gzSize,
    brSize,
    gzRatio: gzSize ? ((gzSize / size) * 100).toFixed(2) : 0,
    brRatio: brSize ? ((brSize / size) * 100).toFixed(2) : 0,
  }
}

// 主函数
function main() {
  console.log('\n📦 Pro-Columns 包大小分析\n')
  console.log('═'.repeat(80))

  const files = ['pro-columns.mjs', 'pro-columns.cjs']
  const results = files.map(analyzeFile).filter(Boolean)

  if (results.length === 0) {
    console.log('❌ 未找到构建产物，请先运行 pnpm run build')
    process.exit(1)
  }

  // 打印表格
  console.log('\n文件名               原始大小      Gzip压缩     Brotli压缩   Gzip比率  Brotli比率')
  console.log('─'.repeat(80))

  results.forEach((result) => {
    const {
      fileName,
      size,
      gzSize,
      brSize,
      gzRatio,
      brRatio,
    } = result

    console.log(
      `${fileName.padEnd(18)} ` +
        `${formatSize(size).padEnd(12)} ` +
        `${formatSize(gzSize).padEnd(12)} ` +
        `${formatSize(brSize).padEnd(14)} ` +
        `${gzRatio}%`.padEnd(8) +
        `  ${brRatio}%`
    )
  })

  console.log('═'.repeat(80))

  // 总大小
  const totalSize = results.reduce((sum, r) => sum + r.size, 0)
  const totalGzSize = results.reduce((sum, r) => sum + r.gzSize, 0)
  const totalBrSize = results.reduce((sum, r) => sum + r.brSize, 0)

  console.log(`\n总计:`)
  console.log(`  原始大小:    ${formatSize(totalSize)}`)
  console.log(`  Gzip 压缩:   ${formatSize(totalGzSize)} (${((totalGzSize / totalSize) * 100).toFixed(2)}%)`)
  console.log(`  Brotli 压缩: ${formatSize(totalBrSize)} (${((totalBrSize / totalSize) * 100).toFixed(2)}%)`)

  // 建议
  console.log('\n💡 优化建议:')

  if (totalSize > 100 * 1024) {
    console.log('  • 包大小超过 100KB，考虑进一步优化或拆分')
  } else {
    console.log('  ✅ 包大小合理')
  }

  if (totalGzSize / totalSize > 0.5) {
    console.log('  • Gzip 压缩比较低，考虑优化代码重复度')
  } else {
    console.log('  ✅ Gzip 压缩效果良好')
  }

  // 查看分析报告
  const statsPath = path.join(distDir, 'stats.html')
  if (fs.existsSync(statsPath)) {
    console.log(`\n📊 详细分析报告: ${statsPath}`)
  }

  console.log('\n')
}

main()
