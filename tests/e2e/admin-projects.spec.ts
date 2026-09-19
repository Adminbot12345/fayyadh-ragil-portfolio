import { test, expect } from '@playwright/test'
const email=process.env.E2E_ADMIN_EMAIL,password=process.env.E2E_ADMIN_PASSWORD

test.describe('admin project workflow',()=>{
  test.skip(!email||!password,'E2E admin credentials not configured')
  test.beforeEach(async({page})=>{await page.goto('/admin/login');await page.getByLabel('Email').fill(email!);await page.getByLabel('Password').fill(password!);await page.getByRole('button',{name:'Sign in'}).click();await expect(page).toHaveURL(/\/admin$/)})
  test('creates, previews, publishes, features and deletes a draft',async({page})=>{
    const token=Date.now();const title=`E2E Demo ${token}`;const slug=`e2e-demo-${token}`
    await page.goto('/admin/projects/new');await page.getByLabel('Title').fill(title);await page.getByLabel('Slug').fill(slug);await page.getByLabel('Category').selectOption('Motion Design');await page.getByLabel('Description').fill('Temporary E2E project.');await page.getByRole('button',{name:'Save project'}).click();await expect(page.getByRole('status')).toContainText('created')
    await page.goto('/admin/projects');const row=page.getByRole('row').filter({hasText:title});await expect(row).toBeVisible();await row.getByRole('link',{name:'Preview'}).click();await expect(page.getByRole('heading',{name:title})).toBeVisible();await page.goto('/admin/projects');const row2=page.getByRole('row').filter({hasText:title});await row2.getByRole('button',{name:'Draft'}).click();await page.reload();await expect(page.getByRole('row').filter({hasText:title}).getByRole('button',{name:'Published'})).toBeVisible();await page.getByRole('row').filter({hasText:title}).getByRole('button',{name:/Set featured/}).click();await page.reload();await expect(page.getByRole('row').filter({hasText:title})).toContainText('Featured');page.once('dialog',d=>d.accept());await page.getByRole('row').filter({hasText:title}).getByRole('button',{name:'Delete'}).click();await page.reload();await expect(page.getByText(title)).toHaveCount(0)
  })
})

test.describe('admin content controls',()=>{
  test.skip(!email||!password,'E2E admin credentials not configured')
  test.beforeEach(async({page})=>{await page.goto('/admin/login');await page.getByLabel('Email').fill(email!);await page.getByLabel('Password').fill(password!);await page.getByRole('button',{name:'Sign in'}).click();await expect(page).toHaveURL(/\/admin$/)})
  test('reorders projects and can manage a temporary skill',async({page})=>{
    await page.goto('/admin/projects')
    const moveDown=page.getByRole('button',{name:/Move .* down/}).first()
    if(await moveDown.count()){await moveDown.click();await page.getByRole('button',{name:'Save order'}).click()}
    await page.goto('/admin/skills')
    const token=`E2E Skill ${Date.now()}`
    await page.getByPlaceholder('New skill/software').fill(token)
    await page.getByRole('button',{name:'Add'}).click()
    await page.reload()
    const form=page.locator('form').filter({hasText:token})
    await expect(form).toBeVisible()
    await form.getByRole('button',{name:'Delete'}).click()
  })
})
